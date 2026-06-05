using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapDrawingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MapDrawingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Create(CreateMapDrawingDto dto)
    {
        var drawing = new MapDrawing
        {
            Id = Guid.NewGuid(),
            PersonId = dto.PersonId,
            ShapeType = dto.ShapeType,
            GeometryJson = dto.GeometryJson,
            CreatedAt = DateTime.UtcNow
        };

        _context.MapDrawings.Add(drawing);

        _context.SaveChanges();

        return Ok(drawing);
    }
}
