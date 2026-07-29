namespace Universitet.WebAPI
{
    using System;
    using System.Text;
    using ICSSoft.Services;
    using ICSSoft.STORMNET;
    using ICSSoft.STORMNET.Business;
    using ICSSoft.STORMNET.Business.Audit;
    using ICSSoft.STORMNET.Business.Interfaces;
    using ICSSoft.STORMNET.Security;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.OpenApi.Models;
    using NewPlatform.Flexberry.ORM.CurrentUserService;
    using NewPlatform.Flexberry.Services;
    using Swashbuckle.AspNetCore.SwaggerUI;
    using Unity;
    using Unity.Lifetime;
    using Universitet.ApplicationLayer.DTO.Aircraft;
    using Universitet.ApplicationLayer.DTO.Airplane;
    using Universitet.ApplicationLayer.DTO.Airport;
    using Universitet.ApplicationLayer.DTO.Flight;
    using Universitet.ApplicationLayer.DTO.Helicopter;
    using Universitet.ApplicationLayer.DTO.Passenger;
    using Universitet.ApplicationLayer.ExportProviders;
    using Universitet.ApplicationLayer.Helpers;
    using Universitet.ApplicationLayer.Services;
    using Universitet.WebAPI.Utils;

    /// <summary>
    /// Класс настройки запуска приложения.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup" /> class.
        /// </summary>
        /// <param name="configuration">An application configuration properties.</param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// An application configuration properties.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// Configurate the HTTP request pipeline.
        /// </summary>
        /// <remarks>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </remarks>
        /// <param name="app">An application configurator.</param>
        /// <param name="env">Information about web hosting environment.</param>
        /// <param name="config">Application configuration.</param>
        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env, IConfiguration config)
        {
            LogService.LogInfo("Инициирован запуск приложения.");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseSwagger();

                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Universitet API v1");
                    options.RoutePrefix = string.Empty;
                    options.DocExpansion(DocExpansion.None);
                });
            }

            app.UseRouting();

            app.UseCors(builder =>
            {
                builder.AllowAnyHeader();
                builder.AllowAnyMethod();
                builder.AllowCredentials();
                builder.SetIsOriginAllowed(hostName => true);
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/health");
            });
        }

        /// <summary>
        /// Configurate application services.
        /// </summary>
        /// <remarks>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </remarks>
        /// <param name="services">An collection of application services.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            string connStr = Configuration["DefConnStr"];

            services.AddMvcCore().AddApiExplorer();
            services.AddCors();
            services.AddHealthChecks().AddNpgSql(connStr);

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Universitet API",
                });

                string xmlFile = System.IO.Path.ChangeExtension(System.Reflection.Assembly.GetExecutingAssembly().Location, ".xml");
                if (System.IO.File.Exists(xmlFile))
                {
                    options.IncludeXmlComments(xmlFile);
                }
            });
        }

        /// <summary>
        /// Configurate application container.
        /// </summary>
        /// <param name="container">Container to configure.</param>
        public void ConfigureContainer(IUnityContainer container)
        {
            if (container == null)
            {
                throw new ArgumentNullException(nameof(container));
            }

            while (container.Parent != null)
            {
                container = container.Parent;
            }

            container.RegisterInstance(Configuration);
            RegisterOrmServices(container);

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            container.RegisterType<IAircraftService, AircraftService>();
            container.RegisterType<IAirplaneService, AirplaneService>();
            container.RegisterType<IAirportService, AirportService>();
            container.RegisterType<IFlightService, FlightService>();
            container.RegisterType<IHelicopterService, HelicopterService>();
            container.RegisterType<IPassengerService, PassengerService>();
            container.RegisterType<ITicketService, TicketService>();

            container.RegisterType<IExcelExportProvider<AircraftDtoBase>, AircraftLExportProvider>("AircraftLExportProvider");
            container.RegisterType<IExcelExportProvider<AirplaneDtoBase>, AirplaneLExportProvider>("AirplaneLExportProvider");
            container.RegisterType<IExcelExportProvider<AirportDtoBase>, AirportLExportProvider>("AirportLExportProvider");
            container.RegisterType<IExcelExportProvider<FlightDtoBase>, FlightLExportProvider>("FlightLExportProvider");
            container.RegisterType<IExcelExportProvider<HelicopterDtoBase>, HelicopterLExportProvider>("HelicopterLExportProvider");
            container.RegisterType<IExcelExportProvider<PassengerDtoBase>, PassengerLExportProvider>("PassengerLExportProvider");

            container.RegisterSingleton<IHttpContextAccessor, HttpContextAccessor>();
            container.RegisterSingleton<IUserSettingsService, UserSettingsService>();
            container.RegisterSingleton<ILockService, NewPlatform.Flexberry.Services.LockService>();
            container.RegisterType<IServiceProviderIsService, UnityServiceProviderIsService>(new ContainerControlledLifetimeManager());
            container.RegisterType<ServiceHelper>();

            UniversitetCurrentUserService currentUserService = new (container.Resolve<IHttpContextAccessor>(), container.Resolve<IDataService>());

            container.RegisterInstance<IUniversitetCurrentUserService>(currentUserService);
            container.RegisterInstance<ICurrentUser>(currentUserService);
        }

        /// <summary>
        /// Register ORM implementations.
        /// </summary>
        /// <param name="container">Container to register at.</param>
        private void RegisterOrmServices(IUnityContainer container)
        {
            string connStr = Configuration["DefConnStr"];

            if (string.IsNullOrEmpty(connStr))
            {
                throw new System.Configuration.ConfigurationErrorsException("DefConnStr is not specified in Configuration or environment variables.");
            }

            container.RegisterSingleton<ISecurityManager, EmptySecurityManager>();
            container.RegisterSingleton<IAuditService, EmptyAuditService>();
            container.RegisterFactory<IBusinessServerProvider>(o => new BusinessServerProvider(new UnityServiceProvider(o)), FactoryLifetime.Singleton);

            container.RegisterSingleton<IDataService, PostgresDataService>(
                Inject.Property(nameof(PostgresDataService.CustomizationString), connStr));
        }
    }
}
