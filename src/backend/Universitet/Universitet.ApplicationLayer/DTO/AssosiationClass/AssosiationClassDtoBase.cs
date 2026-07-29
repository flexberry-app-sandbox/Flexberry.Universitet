namespace Universitet.ApplicationLayer.DTO.AssosiationClass
{
    using System;
    using Universitet;

    /// <summary>
    /// Базовое DTO для AssosiationClass.
    /// </summary>
    public class AssosiationClassDtoBase
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
        public virtual AssosiationClassDtoBase FillFromClass(AssosiationClass source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(AssosiationClass destination)
        {
            throw new NotImplementedException();
        }
    }
}
