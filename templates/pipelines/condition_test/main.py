from kfp.dsl import RUN_ID_PLACEHOLDER
from kfp.v2.dsl import Condition, pipeline

from src.pipelines.util import compile_pipeline, load_component

return_string_op = load_component("return_string")


@pipeline(name="return-string-test")
def test(s: str):
    returned = return_string_op(s)
    with Condition(returned.output == "again"):
        return_string_op("condition evaluated to true")


def main():
    compile_pipeline(test, file=__file__, node_pool="high-cpu")


if __name__ == "__main__":
    main()
