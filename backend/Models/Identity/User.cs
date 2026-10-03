namespace backend.Models.Identity;

public class User
{
    public int Id { get; set; }

    public string Emri { get; set; } = string.Empty;
    public string Mbiemri { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public bool EmailConfirmed { get; set; } = false;
    public bool LockoutEnabled { get; set; } = false;
    public int AccessFailedCount { get; set; } = 0;

    public DateTime DataKrijimit { get; set; } = DateTime.UtcNow;
    public bool Statusi { get; set; } = true;


    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<UserClaim> UserClaims { get; set; } = new List<UserClaim>();
    public ICollection<UserToken> UserTokens { get; set; } = new List<UserToken>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();
    public ICollection<ProjectMember> ProjectMembers { get; set; } = new List<ProjectMember>();
    public ICollection<Task> AssignedTasks { get; set; } = new List<Task>();
    public ICollection<TaskComment> TaskComments { get; set; } = new List<TaskComment>();
    public ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();

}