import json
import requests
from typing import Union, List, Dict, Any, Optional

class BlackSMSError(Exception):
    """Base exception for BlackSMS SDK."""
    pass

class BlackSMSAPIError(BlackSMSError):
    """Exception raised when API returns an error response."""
    def __init__(self, message: str, status_code: Optional[int] = None, response: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response = response

class BlackSMS:
    """Official Python Client for BlackSMS API."""
    def __init__(self, api_key: str, base_url: str = "https://blacksms.in", timeout: int = 15):
        if not api_key:
            raise BlackSMSError("BlackSMS api_key cannot be empty.")
        self.api_key = api_key.strip()
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.base_url}/{path.lstrip('/')}"
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        try:
            res = requests.post(url, headers=headers, json=payload, timeout=self.timeout)
            try:
                data = res.json()
            except ValueError:
                data = {"raw": res.text}

            if not res.ok:
                msg = data.get("message", f"HTTP status {res.status_code}")
                raise BlackSMSAPIError(msg, status_code=res.status_code, response=data)

            if isinstance(data, dict):
                if data.get("status") == 0 or data.get("success") is False:
                    msg = data.get("message", "API Request Failed")
                    raise BlackSMSAPIError(msg, status_code=res.status_code, response=data)

            return data
        except requests.RequestException as e:
            raise BlackSMSError(f"Network error: {str(e)}")

    def send_sms(
        self,
        numbers: Union[str, List[str]],
        code: Optional[str] = None,
        variables_values: Optional[str] = None,
        sender_id: Optional[str] = None,
        route: int = 1
    ) -> Dict[str, Any]:
        """Send SMS OTP."""
        num_str = ",".join(numbers) if isinstance(numbers, list) else str(numbers)
        val = variables_values or code or ""
        payload = {
            "numbers": num_str,
            "variables_values": val,
            "route": route
        }
        if sender_id:
            payload["sender_id"] = sender_id
        return self._post("/sms", payload)

    def send_whatsapp(
        self,
        numbers: Union[str, List[str]],
        code: Optional[str] = None,
        variables_values: Optional[str] = None,
        sender_id: Optional[str] = None,
        route: int = 1
    ) -> Dict[str, Any]:
        """Send WhatsApp OTP."""
        num_str = ",".join(numbers) if isinstance(numbers, list) else str(numbers)
        val = variables_values or code or ""
        payload = {
            "numbers": num_str,
            "variables_values": val,
            "route": route
        }
        if sender_id:
            payload["sender_id"] = sender_id
        return self._post("/wasms", payload)

    def send_quick_sms(
        self,
        numbers: Union[str, List[str]],
        message: str,
        sender_id: Optional[str] = None,
        route: Optional[int] = None
    ) -> Dict[str, Any]:
        """Send Quick SMS."""
        num_str = ",".join(numbers) if isinstance(numbers, list) else str(numbers)
        payload = {
            "numbers": num_str,
            "message": message
        }
        if sender_id:
            payload["sender_id"] = sender_id
        if route is not None:
            payload["route"] = route
        return self._post("/quick-sms", payload)

    def create_bulk_sms_campaign(
        self,
        title: str,
        message: str,
        contacts: List[str]
    ) -> Dict[str, Any]:
        """Create Bulk SMS Campaign."""
        payload = {
            "title": title,
            "message": message,
            "contacts": contacts if isinstance(contacts, list) else [contacts]
        }
        return self._post("/endpoints/v1/bulk-sms", payload)
