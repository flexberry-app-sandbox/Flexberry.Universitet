namespace Universitet.ApplicationLayer.DTO.Ticket
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для Ticket.
    /// </summary>
    public class TicketDtoBase
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
        public virtual TicketDtoBase FillFromClass(Ticket source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Ticket destination)
        {
            throw new NotImplementedException();
        }
    }
}
