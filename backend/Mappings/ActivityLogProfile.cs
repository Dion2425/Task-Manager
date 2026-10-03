using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.ActivityLog;

namespace backend.Mappings;
public class ActivityLogProfile : Profile
{
    public ActivityLogProfile()
    {
        CreateMap<ActivityLogCreateDto, ActivityLog>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Data, opt => opt.MapFrom(_ => DateTime.UtcNow));

        CreateMap<ActivityLog, ActivityLogReadDto>()
            .ForMember(dest => dest.EmriProjektit, opt => opt.MapFrom(src => src.Project.Emertimi))
            .ForMember(dest => dest.EmriPerdoruesit, opt => opt.MapFrom(src => $"{src.User.Emri} {src.User.Mbiemri}"));

    }
}