namespace backend.DTOs.Roles;
public class RoleReadDto
{
    public int Id { get; set; }
    public string Emertimi { get; set; } = string.Empty;
    public string Pershkrimi { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
}