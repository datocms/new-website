import useInterval from '@use-it/interval';
import cn from 'classnames';
import { range } from 'range';
import { useCallback, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import s from './style.module.css';

const images = [
  {
    url: 'https://www.datocms-assets.com/37212/1604653309-lcimg-7386d51f-c838-47d4-bbc0-310f622af5d6.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgVCg0PDQ4VDhUNDRUNDQ0OFxYZGCIfFhUaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLBQUFEAUFEC8cFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA4AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAABAgAEB//EABoQAAIDAQEAAAAAAAAAAAAAAAABAgMEERP/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzezPwFebostDkPXc0gKu2PjHpA7H6xaZAP/Z',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653304-lcimg-8e484b16-671d-46e6-ada9-7bfee6022aa2.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBw4HBg8UEA0HCgcIDQ4OBwgHDREJDQcNFx8ZGBYTFhUaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OFRAFEC8cFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABgAFQMBIgACEQEDEQH/xAAZAAEAAgMAAAAAAAAAAAAAAAAAAgQBAwf/xAAbEAEAAQUBAAAAAAAAAAAAAAAAAgEDESExMv/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A5HZjhO75IMz4gpSpsTl0Ub7Vcp3OACnKWwFH/9k=',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653297-lcimg-95bbc158-8256-4dc9-b1cd-26141d12acb6.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBw0SBhERBxAOCAcHDhgHDgYHCBEJCgoNFxMZGBYfFhUaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDw0OFgUKFS8cFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABgAFAMBIgACEQEDEQH/xAAZAAEAAgMAAAAAAAAAAAAAAAAAAgQBAwf/xAAcEAEAAgIDAQAAAAAAAAAAAAAAAQIDIRIxQhH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOP1ojau1iemv0CMY9CxER8AV4yMctgCcZQEH//Z',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653289-lcimg-ff22e937-8fb1-4d0e-9a7b-834aa5c8988a.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLCgoVDhgQEw0NGCgVFhEiLxodHx0iGiEcHy0lJh0oHSEeJEElKC0vMjI1GSY4PTcwPCsxMi8BCgsLDg0OHBAQHDsoIig7Ozs7Ozs7LzsvNS87Ly87Oy87Lzs7Oy87Ly87Oy8vLzUvLy8vLy8vLy8vLy8vLy8vL//AABEIAA4AGAMBIgACEQEDEQH/xAAXAAEAAwAAAAAAAAAAAAAAAAAFAAMG/8QAHRAAAQQDAQEAAAAAAAAAAAAAAQACAwQFITERE//EABUBAQEAAAAAAAAAAAAAAAAAAAQD/8QAGBEAAgMAAAAAAAAAAAAAAAAAAQIAESH/2gAMAwEAAhEDEQA/AMFRgE52kzim/P1B1Ljq7tD1Lsyb3x8SyxvINQK2CZiAVgSFFRnLDpZWtPOqKTOwMQiisn//2Q==',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653278-lcimg-03350c72-f71b-46e6-9297-33aeb22d40f7.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBg0OEBASDw0NDQwNCw0NDhENDhENFxYZGBYTFiEaHysjGh0oHSEWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDgwPFQ0QHC8dFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA0AGAMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAACAwQB/8QAGRAAAwEBAQAAAAAAAAAAAAAAAAECAxET/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQD/xAAWEQEBAQAAAAAAAAAAAAAAAAAAIQH/2gAMAwEAAhEDEQA/AEpqgvNES0pDp2rg4B1PDSfTRmko/9k=',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653278-lcimg-cd1d8357-4ba0-454b-a761-8abc76c73a4f.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLChUWDg8QDQ0NFBgXEA0YFx4ZGBYTFhgeHyslGh0oHSEWJDUlKDkvMjIyGSI4PTcwPCsxMi8BCgsLDg0PEA0OFi8cFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA0AGAMBEQACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAEBwIDBf/EAB4QAAEDBAMAAAAAAAAAAAAAAAMAAQIEBREhBhIx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAQAC/8QAFxEBAQEBAAAAAAAAAAAAAAAAABEBEv/aAAwDAQACEQMRAD8AbNTcxU8c+oooQfIAzljDI6HWJFvQ4tpXS6wHcRNKG1RRkgp4NNZjMW1Am6o3Gdx//9k=',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653272-lcimg-59fba855-14f8-4b57-b2ef-7438f04908b9.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBhEICBQSDgoNDRgQCA0NDhENFhEOFxMaGBYfFhUaHysjGikoHRUiJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBAQHDsoIhwvLy8vLzUvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA4AGAMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAAAAwcE/8QAGxAAAgIDAQAAAAAAAAAAAAAAAAMBBAIRMSH/xAAVAQEBAAAAAAAAAAAAAAAAAAACAf/EABgRAAMBAQAAAAAAAAAAAAAAAAABEQIh/9oADAMBAAIRAxEAPwCiOTqBS1+i22cpBLZ6XVDiJdHMRuAM1i3lhwBIDSp//9k=',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653263-lcimg-19d757f7-408e-4a6e-9733-86a6cae39919.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoUDwgLDQ0NDxgJDQ0NDRINDRENFxUlGBYTFhUaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBAQHDseIig7Oy87NS8vNS8vLy8vLzUvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA4AGAMBIgACEQEDEQH/xAAXAAEAAwAAAAAAAAAAAAAAAAAFAAIH/8QAHBABAAEEAwAAAAAAAAAAAAAAAQACBAURAyEx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgEA/8QAGBEBAAMBAAAAAAAAAAAAAAAAAQACEQP/2gAMAwEAAhEDEQA/ANDq5QpguS5wWIKpBcmdM1kCLlVemS9neUkkMtt79kkrqR9qhfJ//9k=',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653255-lcimg-47c5bf11-1616-48da-b9b5-8da9d448c421.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoPCAgLEg0ODRgNDhENDh0NDhENFxUZGBYfFhUaHysvGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDgsOHA0QHDsoIhwvLy8vNS87NTUvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA0AGAMBIgACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAABBAMFBwD/xAAeEAABAwQDAAAAAAAAAAAAAAAAAQMSAgQRMRMVIf/EABYBAQEBAAAAAAAAAAAAAAAAAAIDAP/EABcRAAMBAAAAAAAAAAAAAAAAAAABERL/2gAMAwEAAhEDEQA/AMkas5L6ox11OAM1rka5FiVWQ1la7Zw0pxO+4oAuGrP/2Q==',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653249-lcimg-a3b3b66b-d22f-4aa5-a974-c4a60509f6e7.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoSCAgLFRULDhgQFA0YDhUNDw0YFxUlHRsfFiEdHysjHR0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBAQHDIoIig7Oy87Oy8vLy8vOzU2LzU1PDYvLy8vLy8vLzsvLzUvLy8vLy8vLy8vNS8vLy8vLy8vL//AABEIABMAGAMBIgACEQEDEQH/xAAbAAABBAMAAAAAAAAAAAAAAAAAAQUGBwIDBP/EACIQAAEDAwMFAAAAAAAAAAAAAAEAAgMEBjEFEkEREyFRcf/EABcBAQEBAQAAAAAAAAAAAAAAAAMCAQD/xAAZEQACAwEAAAAAAAAAAAAAAAAAAQIREjL/2gAMAwEAAhEDEQA/ALS16pbT0R6ppt3U45pT0PKzvEPdQu2+lGbLhmbKd5OUkVcGw9PVFh1czWxZylXDXhwhSKEIabnANKfiaLXa0SHxyhCpcmokuogdoIQhGjj/2Q==',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653249-lcimg-b65bdc65-0f38-42c5-8042-27fcc5f13c2f.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLCg4LDhUQDQ4VDh0eDRUNFxUlGCIfFhUdHysjGh0oHRUiJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBAQHDsoIh07NS87Ozs7Lzs7LzsvLzsvLy87Ozs7Oy81Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA0AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAABAMFBv/EAB8QAAAGAQUAAAAAAAAAAAAAAAABAgMFEQQGEiEiMf/EABYBAQEBAAAAAAAAAAAAAAAAAAQDAv/EABwRAAEEAwEAAAAAAAAAAAAAAAEAAgMhESJBEv/aAAwDAQACEQMRAD8A3DOqEun4H0zpEi6CiIjFQfCQyUeztqhiTPFaEt8bKolNVpZuyAJM6GxHD7JsARGWhtorxk0v/9k=',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653242-lcimg-ef9f60a6-a2f4-4905-b8d5-15733ff6d66f.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzIvJik0KR4iMEUxNDk7PjI+Ii5EST08SDc9OjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7Lzs7Ozs7Ozs7Ozs7Oy87Ozs7Ozs7Ozs7Ozs7OzsvOzs7Lzs7Ozs7Ozs7O//AABEIAA4AGAMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAAGBwgA/8QAIhAAAQMEAgIDAAAAAAAAAAAAAQIDBQAEESEGQTEzBxIT/8QAFgEBAQEAAAAAAAAAAAAAAAAABAMC/8QAHBEAAgEFAQAAAAAAAAAAAAAAAQIAAxEhIkEE/9oADAMBAAIRAxEAPwBrSMo1aMKUT1SwmPkWPYkfxUved4HijLkDX3tFjPVT9Ox4bn1NBXsWME9Z1S/NQFQmQdnDheShuNzjV3bJUkggitQ9w22DFg0gHQSBWorrZsTe0//Z',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653235-lcimg-278c600a-cd13-4440-87d6-d429c1f898d9.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBhYICAgLChYVDhUcDg0VDh0VFhwYFxUdGBYmGBkdHys7HR0oHRoiJTUxKi0vMjIyGSI4PTcwPSsxMi8BCgsLDg0OHBAQHDsoIiI7NS82Ozs7Ozs7Oy8vLy8vNTsvOzs7OzsvNS8vLy8vNTU7NTs1Ly8vLy8vLy8vLy8vL//AABEIABEAGAMBIgACEQEDEQH/xAAaAAACAgMAAAAAAAAAAAAAAAAABAUGAQMH/8QAIBAAAQQBBAMAAAAAAAAAAAAAAAECAwQxBRESgSEyQf/EABgBAAIDAAAAAAAAAAAAAAAAAAMEAQIF/8QAHBEAAgMAAwEAAAAAAAAAAAAAAAECAzETQVER/9oADAMBAAIRAxEAPwB+vr9dzvD0Xsl4dZi4eyHK4YLKO+oTEDrCR7K5RWMW19ZlV22dot1/XIW5cgFCvw2pF35KoA5OSeE8tvg4zI3HgAGo4MLDVOZAAb0uj//Z',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653235-lcimg-8da60b9b-1d2c-491a-ac97-369d11dd7158.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoIEggLFgoVDhYbDg0YFhwNFhUVFx8fGCIaFhcdIy0mHR0oHRoWJTUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBAQHC8oIig7Ozs7Oy87LzsvOzsvLzUvOzsvLy80Ly87LzsvLzUvLzsvLzUvMC8vLy8vLy8vNS8vL//AABEIABEAGAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAABQYBBP/EACIQAAICAQIHAQAAAAAAAAAAAAABAgMFBBIRMTIzNGGBFP/EABcBAQEBAQAAAAAAAAAAAAAAAAQDAgD/xAAcEQACAgMBAQAAAAAAAAAAAAAAAQIDBBEyEjH/2gAMAwEAAhEDEQA/AL3JalVVtk9DOU/o2blx4jXN1ynQ16ISrD2vJu7fLnyJ2ynHlCsGuuTft6L2rWxnBMw4dLRKFSQFo7aA5C1Y/I0yvaZOUeR9NA6YjHHNfQgADcfge3o//9k=',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653235-lcimg-6bd64cac-e621-45da-a6a1-c7714a6a1c79.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgwOEwsNDQsUDxALBw0NCBENDQcNFxUZGCIVFhUaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OEA0QHS8cFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABMAGAMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAABAUBBwL/xAAfEAABAwMFAAAAAAAAAAAAAAAAAQIyAwQSBRMiIzP/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQID/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/AOg3K4tE2XCZDWoL1kakrt0tlVR3JAMpRNBUe72BLp+hoBAfZEAARv/Z',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653227-lcimg-ab56328a-6fef-4408-a33b-80d3101925c7.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBhIICAgLChILDg4VDg0NGhgdDxEMFxUZGBYTIhUeKy0lGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OFhAQHDsdIhwvLy8vLzs7Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA4AGAMBIgACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAADBAEFBwD/xAAeEAABAwQDAAAAAAAAAAAAAAAAAQMEAhESIQVBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAEA/8QAFREBAQAAAAAAAAAAAAAAAAAAIQD/2gAMAwEAAhEDEQA/AMkYio4ux1OOoxK5qVW2voynKVWtiJDDkxEb2hwJ6XU71Ykim//Z',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653218-lcimg-cd771c7e-ff1e-4748-ad34-87d25608b06f.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFgoLDiQQDhcYFx0VFhEYIx8dHSIfFhUdHysjGh0oKRkiJUElKC0vMjIyHSc4PTcwSC41Mi8BCgsLDg0OHBAQHC8lIig7OzsvLy8vLy8vLzUvLzs1Ly8vLy8vLy8vLy8vNS8vLy8vLy8vLzU1NS8vLy8vLy8vL//AABEIABgAFQMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAAABQYHA//EACMQAAEDAwMFAQAAAAAAAAAAAAABAgQDEUEFITEGFDJRcRX/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABgRAQEBAQEAAAAAAAAAAAAAAAEAIQIS/9oADAMBAAIRAxEAPwDI4EN0utZPFOSeqaJehay8HPp1jLJ9Lc5jO3xwU4pvSNmMmg6NXdSdgEh1AjUn7egTZmlz0masasjVXZS1fp3j84AD6Rim1O1GR3Ex78JsgAFO/9k=',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653210-lcimg-0e7c2b0c-1db5-42c4-8bf8-3fec945fec55.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICA8LEw4LDhgQDQ0NDREVFgsOFx8ZGCIfIhUmHysjHR0oHRYiMDUlKC0vMjIyGS44PTcwPCsxMi8BCgsLDg0OHA8QHTUcIx0zOzU1Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABIAGAMBIgACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAAABQQGBwH/xAAgEAABBAEEAwAAAAAAAAAAAAAAAQIDBCEFEUFREhMx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAERQf/aAAwDAQACEQMRAD8AyrSK6yyq7rA6npr6hbosrY0z2OprLHRmpEVW1WcyVduQJtuRqPVTow1Eorkabr4ABOBXe+gAFg//2Q==',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653210-lcimg-8709e492-74df-408c-b125-e8e10c14fd8a.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICBEWDQoLDhgQFRkUEhUODRAkFxMZGBYTFiEaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBANFTsoFigvLy87LzsvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA8AGAMBIgACEQEDEQH/xAAZAAABBQAAAAAAAAAAAAAAAAAFAAEDBAf/xAAfEAACAQMFAQAAAAAAAAAAAAAABAEDEhMFESEiMQL/xAAVAQEBAAAAAAAAAAAAAAAAAAABAP/EABYRAQEBAAAAAAAAAAAAAAAAAAAhAf/aAAwDAQACEQMRAD8AyBRfP98+BSNOiwoI1cchWG+owaENq4Z3gRK9VugcoX//2Q==',
  },
  {
    url: 'https://www.datocms-assets.com/37212/1604653204-lcimg-0df84ca1-2cac-4183-8f0b-9a587a2a1060.jpg?ar=2.5&auto=format&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBhYICAgLChYSDg4ODA0NDh0VFhEYFxUZGBYTFhUaKzEjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OEA8QGi8oFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA8AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAEBQAGB//EABwQAAEEAwEAAAAAAAAAAAAAAAABAhExAwUSBP/EABUBAQEAAAAAAAAAAAAAAAAAAAEA/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwDO8MTYc2ObKzj2GRi1IQm4ciRyoygy9UKQUZdk99IQtL//2Q==',
  },
];

const Copy = ({ lines }) => (
  <div className={s.paragraph}>
    {range(0, lines - 1).map((i) => (
      <div key={i} className={s.copy} />
    ))}
    <div className={s.copy} style={{ width: '60%' }} />
  </div>
);

export default function ProgressiveImagesDemo() {
  const [post, setPost] = useState(0);

  const next = useCallback(() => {
    setPost((post) =>
      post >= images.length ? post - images.length + 1 : post + 1,
    );
  }, [setPost]);

  useInterval(() => {
    next();
  }, 2000);

  useEffect(() => {
    for (const image of images) {
      const i = new Image();
      i.src = image.url;
    }
    next();
  }, [next]);

  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.window}>
          <div className={s.windowBar}>
            <div />
          </div>
          <div className={s.browserBar}>
            <div className={s.addressBar} />
          </div>
          <TransitionGroup className={s.page}>
            <CSSTransition key="static-1" timeout={100}>
              <div className={s.pageTitle}>Live blog</div>
            </CSSTransition>
            <CSSTransition key="static-2" timeout={100}>
              <div className={s.pageSubtitle}>
                <div className={s.ping} /> Connected to DatoCMS, receiving live
                updates!
              </div>
            </CSSTransition>
            {range(post + 3, post, -1).map((i) => {
              const indexInRange =
                i < 0
                  ? i + images.length
                  : i >= images.length
                    ? i - images.length
                    : i;

              const image = images[indexInRange];

              return (
                <CSSTransition
                  key={indexInRange}
                  classNames={{
                    enter: s.postEnter,
                    enterActive: s.postEnterActive,
                    exit: s.postLeave,
                    exitActive: s.postLeaveActive,
                  }}
                  timeout={1400}
                >
                  <div className={s.post}>
                    <div className={s.postInner}>
                      <div
                        className={cn(s.image)}
                        style={{
                          backgroundImage: `url(${image.blurUpThumb})`,
                        }}
                      >
                        <img src={image.url} />
                      </div>
                      <Copy lines={2} />
                    </div>
                  </div>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
}
