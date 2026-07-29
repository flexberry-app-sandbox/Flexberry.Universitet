namespace Universitet.ApplicationLayer.DTO.Passenger
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для Passenger.
    /// </summary>
    public class PassengerDtoBase
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
        public virtual PassengerDtoBase FillFromClass(Passenger source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Passenger destination)
        {
            throw new NotImplementedException();
        }
    }
}
