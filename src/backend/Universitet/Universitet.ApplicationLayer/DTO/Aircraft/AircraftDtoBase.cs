namespace Universitet.ApplicationLayer.DTO.Aircraft
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для Aircraft.
    /// </summary>
    public class AircraftDtoBase
    {
        /// <summary>
        /// Id.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Заполняет ДТО данными из переданного объекта.
        /// </summary>
        /// <param name="source">Объект с данными.</param>
        /// <returns>Полученное ДТО.</returns>
        public virtual AircraftDtoBase FillFromClass(Aircraft source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Aircraft destination)
        {
            throw new NotImplementedException();
        }
    }
}
