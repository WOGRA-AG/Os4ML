from yaml.parser import ParserError

from src.exceptions import MalformedTemplateException
from src.parser.init_parser import init_parser
from src.parser.interfaces.parser import Parser


class PipelineTemplateService:
    def get_pipeline_template(
        self,
        template_name: str,
        user_token: str,
        parser: Parser = init_parser(),
    ) -> dict:
        try:
            return parser.get_pipeline_template_by_name(
                name=template_name,
                user_token=user_token,
            )
        except ParserError as e:
            raise MalformedTemplateException(name=template_name, err=repr(e))
