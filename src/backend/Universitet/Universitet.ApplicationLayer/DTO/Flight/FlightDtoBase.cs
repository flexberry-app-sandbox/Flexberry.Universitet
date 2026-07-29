namespace Universitet.ApplicationLayer.DTO.Flight
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для Flight.
    /// </summary>
    public class FlightDtoBase
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
        public virtual FlightDtoBase FillFromClass(Flight source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Flight destination)
        {
            throw new NotImplementedException();
        }
    }
}
