namespace Universitet.ApplicationLayer.Mapping
{
    using System;
    using Universitet;
    using Universitet.ApplicationLayer.DTO.Airplane;

    /// <summary>
    /// Статический маппер для преобразования между сущностью <see cref="Airplane"/> и её DTO.
    /// </summary>
    public static class AirplaneMapper
    {
        /// <summary>
        /// Преобразует <see cref="Airplane"/> в указанный DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="source">Исходная сущность.</param>
        /// <returns>Указанный DTO.</returns>
        public static TDto MapToDto<TDto>(this Airplane source)
            where TDto : AirplaneDtoBase, new()
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            TDto result = new TDto();

            return (TDto)result.FillFromClass(source);
        }

        /// <summary>
        /// Обновляет поля сущности <see cref="Airplane"/> по данным из DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="destination">Сущность, которую нужно обновить.</param>
        /// <param name="source">DTO с новыми значениями.</param>
        public static void UpdateFromDto<TDto>(this Airplane destination, TDto source)
            where TDto : AirplaneDtoBase
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
