namespace Universitet.ApplicationLayer.DTO.Airplane
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для Airplane.
    /// </summary>
    public class AirplaneDtoBase
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
        public virtual AirplaneDtoBase FillFromClass(Airplane source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Airplane destination)
        {
            throw new NotImplementedException();
        }
    }
}
