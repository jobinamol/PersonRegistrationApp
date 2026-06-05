namespace backend.DTOs;

public class CreateMapDrawingDto
{
    public Guid PersonId { get; set; }

    public string ShapeType { get; set; } = string.Empty;

    public string GeometryJson { get; set; } = string.Empty;
}