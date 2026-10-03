using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.TaskComment;
public class TaskCommentUpdateDto
    {
        [Required]
        [MaxLength(2000)]
        public string Komenti { get; set; } = string.Empty;
    }
