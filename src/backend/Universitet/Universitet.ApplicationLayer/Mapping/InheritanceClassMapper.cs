namespace Universitet.ApplicationLayer.Mapping
{
    using System;
    using Universitet;
    using Universitet.ApplicationLayer.DTO.InheritanceClass;

    /// <summary>
    /// Статический маппер для преобразования между сущностью <see cref="InheritanceClass"/> и её DTO.
    /// </summary>
    public static class InheritanceClassMapper
    {
        /// <summary>
        /// Преобразует <see cref="InheritanceClass"/> в указанный DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="source">Исходная сущность.</param>
        /// <returns>Указанный DTO.</returns>
        public static TDto MapToDto<TDto>(this InheritanceClass source)
            where TDto : InheritanceClassDtoBase, new()
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            TDto result = new TDto();

            return (TDto)result.FillFromClass(source);
        }

        /// <summary>
        /// Обновляет поля сущности <see cref="InheritanceClass"/> по данным из DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="destination">Сущность, которую нужно обновить.</param>
        /// <param name="source">DTO с новыми значениями.</param>
        public static void UpdateFromDto<TDto>(this InheritanceClass destination, TDto source)
            where TDto : InheritanceClassDtoBase
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            if (destination == null)
            {
                throw new ArgumentNullException(nameof(destination));
            }

            source.UpdateFromDto(destination);
        }
    }
}
