namespace Universitet.ApplicationLayer.DTO.Helicopter
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для Helicopter.
    /// </summary>
    public class HelicopterDtoBase
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
        public virtual HelicopterDtoBase FillFromClass(Helicopter source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Helicopter destination)
        {
            throw new NotImplementedException();
        }
    }
}
