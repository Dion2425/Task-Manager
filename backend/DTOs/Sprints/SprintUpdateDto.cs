using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Sprints;
public class SprintUpdateDto
{
    [Required]
    [MaxLength(200)]
    public string Emertimi { get; set; } = string.Empty;

    [Required]
    public DateTime DataFillimit { get; set; }

    [Required]
    public DateTime DataPerfundimit { get; set; }

    [MaxLength(50)]
    public string Statusi { get; set; } = string.Empty; // Planifikuar, Aktiv, Perfunduar
}