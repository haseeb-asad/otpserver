import requests
import time
from datetime import datetime
import threading
from concurrent.futures import ThreadPoolExecutor

def send_message(number, company, name):
    start_time = time.time()
    print(f"Sending message to {number} for {company} by {name}...")
    url = 'http://35.223.83.127:3000/request-otp'
    # url = 'https://nextotp.tech/api/request-otp'                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    headers = {'apiKey': "5185e1df-f450-49ae-a308-92d75b2e349"}
    data = { 'number': number, 'name': name, 'otp': 12345, 'apiKey': '5185e1df-f450-49ae-a308-982d75b2e349', "company": company }

    response = requests.post(url, json=data)
    print(response.text)
    end_time = time.time()
    execution_time = end_time - start_time
    
    # print(f"Thread: {threading.current_thread().name}")
    # print(f"Response for UID {uid}: {response.text}")
    print(f"Execution time: {execution_time:.2f} seconds")
    # print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

# List of message tasks
message_tasks = [
    ("923237146391", "Amazon", "Haseeb"),
    ("923237146391", "amazon", "Ahmed"),
    ("923237146391", "google", "Hassan"),
    ("923237146391", "fintrail", "Ali"),
    ("923237146391", "fintrail", "Ahmed"),
    ("923237146391", "fintrail", "Hassan"),
    ("923237146391", "fintrail", "Ali"),
    ("923237146391", "fintrail", "Ahmed"),
    ("923237146391", "fintrail", "Hassan"),
    ("923237146391", "fintrail", "Ali"),
    # ("923237146391", "fintrail", "Ahmed"),
    # ("923424564549", "fintrail", "Hassan"),
    # ("923237146391", "fintrail", "Ali"),
    # ("923424564549", "fintrail", "Ahmed"),
    # ("923237146391", "fintrail", "Hassan"),
    # ("923424564549", "fintrail", "Ali"),
    # ("923237146391", "fintrail", "Ahmed"),
    # ("923424564549", "fintrail", "Hassan"),
    # ("923237146391", "fintrail", "Ali"),
    # ("923424564549", "fintrail", "Ahmed"),
    # ("923424564549", "fintrail", "Hassan"),
    # ("923237146391", "fintrail", "Ali"),
    # ("923424564549", "fintrail", "Ahmed"),
    # ("923237146391", "fintrail", "Hassan"),
]

# Using ThreadPoolExecutor to manage threads
start_total = time.time()

with ThreadPoolExecutor(max_workers=10) as executor:
    # Submit all tasks
    futures = [executor.submit(send_message, *task) for task in message_tasks]

end_total = time.time()
total_time = end_total - start_total

print(f"All messages sent!")
print(f"Total execution time: {total_time:.2f} seconds")