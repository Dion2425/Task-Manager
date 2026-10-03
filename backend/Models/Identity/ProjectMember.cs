namespace backend.Models.Identity;
public class ProjectMember
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public string RoliNeProjekt { get; set; } = "Anetar";
 
        public Project Project { get; set; } = null!;
        public User User { get; set; } = null!;
    }