from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def api_exception_handler(exc, context):
    resp = exception_handler(exc, context)

    if resp is None:
        return Response(
            {
                "ok": False,
                "error": {"code": "server_error", "message": "خطای غیرمنتظره رخ داد."},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            "ok": False,
            "error": {
                "code": "bad_request" if resp.status_code < 500 else "server_error",
                "message": "درخواست نامعتبر است.",
                "details": resp.data,
            },
        },
        status=resp.status_code,
    )
