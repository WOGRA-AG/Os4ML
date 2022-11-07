from build.openapi_server.models.solver import Solver


class SolverService:
    def list_solvers(self) -> list[Solver]:
        return [
            Solver(
                name="databag",
                type="pipeline",
                description="Transforms the input to a pandas dataframe and analyses the datatypes of the columns",
                pipeline_step="prepare",
            ),
            Solver(
                name="ludwig-solver",
                type="pipeline",
                description="Solver with Ludwig AutoML",
                pipeline_step="solver",
            ),
        ]

    def get_solver_by_name(self, solver_name: str) -> Solver:
        all_solvers = self.list_solvers()
        solvers_with_name = [
            solver for solver in all_solvers if solver.name == solver_name
        ]
        if not solvers_with_name:
            raise
        return solvers_with_name.pop()
