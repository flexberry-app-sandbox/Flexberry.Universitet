namespace Universitet.ApplicationLayer.DTO.Class
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для Class.
    /// </summary>
    public class ClassDtoBase
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
        public virtual ClassDtoBase FillFromClass(Class source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Class destination)
        {
            throw new NotImplementedException();
        }
    }
}
