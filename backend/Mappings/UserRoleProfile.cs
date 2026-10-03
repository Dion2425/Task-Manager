using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.UserRole;

namespace backend.Mappings;
public class UserRoleProfile : Profile
{
    public UserRoleProfile()
    {
        CreateMap<UserRoleAssignDto, UserRole>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<UserRole, UserRoleReadDto>()
            .ForMember(dest => dest.EmriPerdoruesit, opt => opt.MapFrom(src => $"{src.User.Emri} {src.User.Mbiemri}"))
            .ForMember(dest => dest.EmriRolit , opt => opt.MapFrom(src => src.Role.Emertimi));
    }
}