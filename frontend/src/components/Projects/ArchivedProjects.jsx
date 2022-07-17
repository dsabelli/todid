import { parseJSON, format } from "date-fns";
import { Link } from "react-router-dom";
import Toggle from "../UI/Toggle";
const ArchivedProjects = ({ projects }) => {
  const projectElements = projects.map((project) =>
    project.isArchived ? (
      <Link
        to={`/app/project/archived/${project.id}`}
        key={project.id}
        id={project.id}
      >
        <div>
          {project.title}
          <p>{format(parseJSON(project.archivedOn), "MMM-dd-yyyy")}</p>
        </div>
      </Link>
    ) : null
  );

  return (
    <div className="overflow-y-auto max-h-96 flex flex-col ">
      <Toggle visText="Hide Archived Projects" invisText="Archived Projects">
        {projectElements.reverse()}
      </Toggle>
    </div>
  );
};

export default ArchivedProjects;
