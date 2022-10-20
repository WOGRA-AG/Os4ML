from typing import Dict


class Parser:
    def get_pipeline_template_by_name(
        self, name: str, user_token: str
    ) -> Dict:
        raise NotImplementedError()
