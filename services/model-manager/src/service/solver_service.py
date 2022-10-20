from build.openapi_server.models.solver import Solver


class SolverService:
    def list_solvers(self) -> list[Solver]:
        return [
            Solver(
                name="ludwig-solver",
                type="pipeline",
                description="Solver with Ludwig AutoML",
                pipeline_step="solver",
            )
        ]
