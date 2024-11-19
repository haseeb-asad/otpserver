import requests
import time
from datetime import datetime
import threading
from concurrent.futures import ThreadPoolExecutor

def send_message(number, company, name):
    start_time = time.time()
    
    # url = 'http://44.223.110.139:3000/send-message'
    url = 'http://localhost:3000/send-otp'
    # headers = {'Authorization': f"Bearer {uid}"}
    data = {'company': company, 'number': number, 'name': name, 'otp': '1234'}

    response = requests.post(url, json=data)
    
    end_time = time.time()
    execution_time = end_time - start_time
    
    print(f"Thread: {threading.current_thread().name}")
    print(f"Response for UID {uid}: {response.text}")
    print(f"Execution time: {execution_time:.2f} seconds")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

# List of message tasks
message_tasks = [
    ("923237146391", "fintrail", "Ali"),
    ("923424564549", "fintrail", "Ahmed"),
    ("923237146391", "fintrail", "Hassan"),
    ("923424564549", "fintrail", "Ali"),
    ("923237146391", "fintrail", "Ahmed"),
    ("923424564549", "fintrail", "Hassan"),
    ("923237146391", "fintrail", "Ali"),
    ("923424564549", "fintrail", "Ahmed"),
    ("923237146391", "fintrail", "Hassan"),
    ("923424564549", "fintrail", "Ali"),
    ("923237146391", "fintrail", "Ahmed"),
    ("923424564549", "fintrail", "Hassan"),
    ("923237146391", "fintrail", "Ali"),
    ("923424564549", "fintrail", "Ahmed"),
    ("923237146391", "fintrail", "Hassan"),
    ("923424564549", "fintrail", "Ali"),
    ("923237146391", "fintrail", "Ahmed"),
    ("923424564549", "fintrail", "Hassan"),
    ("923237146391", "fintrail", "Ali"),
    ("923424564549", "fintrail", "Ahmed"),
    ("923424564549", "fintrail", "Hassan"),
    ("923237146391", "fintrail", "Ali"),
    ("923424564549", "fintrail", "Ahmed"),
    ("923237146391", "fintrail", "Hassan"),
    
    
]

# Using ThreadPoolExecutor to manage threads
start_total = time.time()

with ThreadPoolExecutor(max_workers=25) as executor:
    # Submit all tasks
    futures = [executor.submit(send_message, *task) for task in message_tasks]

end_total = time.time()
total_time = end_total - start_total

print(f"All messages sent!")
print(f"Total execution time: {total_time:.2f} seconds")