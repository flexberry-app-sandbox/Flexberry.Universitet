namespace Universitet.ApplicationLayer.DTO.InheritanceClass
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для InheritanceClass.
    /// </summary>
    public class InheritanceClassDtoBase
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
        public virtual InheritanceClassDtoBase FillFromClass(InheritanceClass source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(InheritanceClass destination)
        {
            throw new NotImplementedException();
        }
    }
}
