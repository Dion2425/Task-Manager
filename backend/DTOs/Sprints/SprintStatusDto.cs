using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Sprints;
public class SprintStatusDto
{
    [Required]
    [MaxLength(50)]
    public string Statusi { get; set; } = string.Empty;
}