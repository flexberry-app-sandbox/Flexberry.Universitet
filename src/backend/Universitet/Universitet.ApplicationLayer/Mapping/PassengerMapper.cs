namespace Universitet.ApplicationLayer.Mapping
{
    using System;
    using Universitet;
    using Universitet.ApplicationLayer.DTO.Passenger;

    /// <summary>
    /// Статический маппер для преобразования между сущностью <see cref="Passenger"/> и её DTO.
    /// </summary>
    public static class PassengerMapper
    {
        /// <summary>
        /// Преобразует <see cref="Passenger"/> в указанный DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="source">Исходная сущность.</param>
        /// <returns>Указанный DTO.</returns>
        public static TDto MapToDto<TDto>(this Passenger source)
            where TDto : PassengerDtoBase, new()
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            TDto result = new TDto();

            return (TDto)result.FillFromClass(source);
        }

        /// <summary>
        /// Обновляет поля сущности <see cref="Passenger"/> по данным из DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="destination">Сущность, которую нужно обновить.</param>
        /// <param name="source">DTO с новыми значениями.</param>
        public static void UpdateFromDto<TDto>(this Passenger destination, TDto source)
            where TDto : PassengerDtoBase
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
