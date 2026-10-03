namespace backend.Models.Identity;
public class TaskComment
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public string Komenti { get; set; } = string.Empty;
        public DateTime Data { get; set; } = DateTime.UtcNow;
 
        public Task Task { get; set; } = null!;
        public User User { get; set; } = null!;
    }