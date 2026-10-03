using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.Sprints;

namespace backend.Mappings;
public class SprintProfile : Profile
{
    public SprintProfile()
    {
        CreateMap<SprintCreateDto, Sprint>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Statusi, opt => opt.MapFrom(_ => "Planifikuar"));

        CreateMap<SprintUpdateDto, Sprint>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ProjectId, opt => opt.Ignore());
        
        CreateMap<SprintStatusDto, Sprint>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ProjectId, opt => opt.Ignore())
            .ForMember(dest => dest.Emertimi, opt => opt.Ignore())
            .ForMember(dest => dest.DataFillimit, opt => opt.Ignore())
            .ForMember(dest => dest.DataPerfundimit, opt => opt.Ignore());
        
        CreateMap<Sprint, SprintReadDto>()
            .ForMember(dest => dest.EmriProjektit, opt => opt.MapFrom(src => src.Project.Emertimi));
    }
}