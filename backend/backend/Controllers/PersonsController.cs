using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PersonsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult CreatePerson(CreatePersonDto dto)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.PhoneNumber))
        {
            return BadRequest("All fields are required.");
        }

        // Check duplicate Email or Phone Number
        var existingPerson = _context.Persons.FirstOrDefault(p =>
            p.Email == dto.Email ||
            p.PhoneNumber == dto.PhoneNumber);

        if (existingPerson != null)
        {
            return BadRequest("Email or Phone Number already exists.");
        }

        var person = new Person
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            PhoneNumber = dto.PhoneNumber.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Persons.Add(person);
        _context.SaveChanges();

        return Ok(person);
    }

    [HttpGet]
    public IActionResult GetAllPersons()
    {
        var persons = _context.Persons.ToList();

        return Ok(persons);
    }

    [HttpGet("{id}")]
    public IActionResult GetPersonById(Guid id)
    {
        var person = _context.Persons.FirstOrDefault(x => x.Id == id);

        if (person == null)
        {
            return NotFound();
        }

        return Ok(person);
    }
    [HttpGet("exists")]
    public IActionResult Exists(string email, string phoneNumber)
    {
        var exists = _context.Persons.Any(p =>
            p.Email == email ||
            p.PhoneNumber == phoneNumber);

        return Ok(exists);
    }
}
