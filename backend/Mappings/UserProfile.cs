using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.Users;

namespace backend.Mappings;
public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<UserCreateDto, User>()
            .ForMember(dest => dest.Id,              opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash,    opt => opt.Ignore()) // vendoset nga shërbimi pas hash-imit
            .ForMember(dest => dest.EmailConfirmed,  opt => opt.MapFrom(_ => false))
            .ForMember(dest => dest.LockoutEnabled,  opt => opt.MapFrom(_ => false))
            .ForMember(dest => dest.AccessFailedCount, opt => opt.MapFrom(_ => 0))
            .ForMember(dest => dest.DataKrijimit,    opt => opt.MapFrom(_ => DateTime.UtcNow));

        CreateMap<UserUpdateDto, User>()
            .ForMember(dest => dest.Id,           opt => opt.Ignore())
            .ForMember(dest => dest.Email,        opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.DataKrijimit, opt => opt.Ignore());

        CreateMap<User, UserReadDto>()
            .ForMember(dest => dest.Rolet, opt => opt.MapFrom(
                src => src.UserRoles.Select(ur => ur.Role.Emertimi).ToList()))
            .ForMember(dest => dest.RoleIds, opt => opt.MapFrom(
                src => src.UserRoles.Select(ur => ur.Role.Id).ToList()));
    }
}