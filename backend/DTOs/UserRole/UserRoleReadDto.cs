namespace backend.DTOs.UserRole;

public class UserRoleReadDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string EmriPerdoruesit { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public string EmriRolit { get; set; } = string.Empty;
}