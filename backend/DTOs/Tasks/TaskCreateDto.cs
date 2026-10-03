using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Tasks;
public class TaskCreateDto
{
    [Required]
    public int ProjectId { get; set; }

    [Required(ErrorMessage = "Titulli i detyres eshte i detyrueshem")]
    [MaxLength(300)]
    public string Titulli { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Pershkrimi { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Prioriteti { get; set; } = "Mesatar";

    [MaxLength(50)]
    public string Statusi { get; set; } = "NeBerje"; // NeBerje, NeProgres, NeTestim, Perfunduar

    public int? AssignedTo { get; set; }

    public DateTime? DataAfatit { get; set; }
}