using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Tasks;
public class TaskUpdateDto
{
    [Required]
    [MaxLength(300)]
    public string Titulli { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Pershkrimi { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Prioriteti { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Statusi { get; set; } = string.Empty;

    public int? AssignedTo { get; set; }

    public DateTime? DataAfatit { get; set; }
}