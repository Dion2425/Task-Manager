namespace backend.Models.Identity;
public class ActivityLog
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public string Veprimi { get; set; } = string.Empty;       // "KrijuDetyre", "NdryshueStatusi", etj.
        public string Pershkrimi { get; set; } = string.Empty;
        public DateTime Data { get; set; } = DateTime.UtcNow;
 
        public Project Project { get; set; } = null!;
        public User User { get; set; } = null!;
    }