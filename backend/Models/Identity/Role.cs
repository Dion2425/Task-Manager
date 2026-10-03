namespace backend.Models.Identity;

public class Role
{
    
    public int Id { get; set; }

    public string Emertimi { get; set; } = string.Empty;
    public string? Pershkrimi { get; set; }
    public string NormalizedName { get; set; } = string.Empty;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

}