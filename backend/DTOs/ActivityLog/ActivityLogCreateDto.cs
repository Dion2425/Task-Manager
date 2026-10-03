using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.ActivityLog;
public class ActivityLogCreateDto
{
    [Required]
    public int ProjectId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required(ErrorMessage = "Veprimi eshte i detyrueshem")]
    [MaxLength(100)]
    public string Veprimi { get; set; } = string.Empty;
    // p.sh. KrijuDetyre | NdryshueStatusi | ShtueKoment | FshiDetyre | ShtueAnetar

    [MaxLength(500)]
    public string Pershkrimi { get; set; } = string.Empty;
}