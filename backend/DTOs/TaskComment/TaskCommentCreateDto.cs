using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.TaskComment;
public class TaskCommentCreateDto
{
    [Required]
    public int TaskId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required(ErrorMessage = "Komenti nuk mund te jete bosh")]
    [MaxLength(2000)]
    public string Komenti { get; set; } = string.Empty;
}