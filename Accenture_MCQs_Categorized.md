# Accenture actual paper MCQs

Questions are grouped by topic. Original question numbers are kept so you can match them to the PDF.

## Contents

1. [Cloud computing and DevOps](#1-cloud-computing-and-devops)
2. [Computer networks and security](#2-computer-networks-and-security)
3. [Operating systems and computer architecture](#3-operating-systems-and-computer-architecture)
4. [DBMS, Excel and MS Office](#4-dbms-excel-and-ms-office)

---

## 1. Cloud computing and DevOps

### Q1
In a cloud-based application where scalability is crucial, which cloud storage option allows dynamic scaling without the need for manual intervention?

- a. Block storage
- b. File storage
- c. Object storage
- d. Table storage

**Answer:** c. Object storage

---

### Q6
Assume that you have recently started working for an organization that is migrating to a cloud-based infrastructure. As part of IT governance, you are responsible for ensuring data security in the cloud environment. You are aware of various cloud deployment models and need to choose the most secure option for your organization's sensitive data. In the context of IT governance and cloud security, which cloud deployment model is typically the most secure choice for organizations with highly sensitive data?

**Answer:** Private Cloud

---

### Q11. Hybrid cloud connectivity
An enterprise is adopting a hybrid cloud model where they combine on-premise infrastructure with public cloud services to securely connect these environments and ensure reliability. What solutions should they implement?

**Answer:** Secure VPN or dedicated connectivity like Direct Connect

---

### Q13. DevOps, continuous deployment
An e-commerce company updates its website weekly with new features and fixes. Using an Agile development approach, after each update, the new version is automatically deployed to the live environment. This practice automates the release of software to production frequently and reliably. Which practice is being implemented?

- a. Continuous Deployment
- b. Continuous Integration
- c. Continuous Testing
- d. Monitoring

**Answer:** a. Continuous Deployment

---

### Q18. Containerization concept
A software development team is implementing containerization to streamline application deployment by encapsulating applications and their dependencies. Which characteristic defines containers in the context of software development and deployment?

- A. Virtual machines with a dedicated Hypervisor
- B. A logical separate network within the server
- C. Part of the same OS instance as the Hypervisor
- D. Virtual computers running under a Hypervisor

**Answer:** C. Part of the same OS instance as the Hypervisor

---

### Q20. Cloud elasticity / resource pooling
As part of a data center modernization initiative, the IT team is tasked with addressing storage challenges. The goal is to leverage existing storage devices from various vendors and integrate them with a next-generation storage solution. How does resource pooling play a crucial role in achieving elasticity in storage solutions for cloud computing?

**Answer:** Resource pooling enables dynamic allocation of shared storage capacity to meet demand.

---

### Q22. Cloud traffic spike handling
An e-commerce website experiences sudden traffic spikes during a flash sale. The platform needs to access resources to handle the increase without manual intervention. Which cloud features should be prioritized?

**Answer:** Auto-scaling and load balancing

---

### Q23. Shared responsibility model
Assume that a company migrates its application to a cloud-connected environment where the cloud provider handles infrastructure services while the customer develops and deploys the application. How does the shared responsibility model impact security management in this scenario?

**Answer:** Both the cloud provider and the customer share security responsibilities.

---

### Q27
An application relies on multiple hardware peripherals and requires strict isolation from other running containers to maintain data integrity and operational security. The development team uses a kernel-level configuration to allocate specific hardware resources to each container and restrict access to non-allocated devices. What is the most critical factor in maintaining operational security and preventing resource contention among containers?

- a. Ensuring that the host OS scheduler allocates CPU cycles equally to all containers
- b. Configuring the kernel to enforce strict resource isolation and limit peripheral access to only allocated devices
- c. Allowing virtualization software to dynamically allocate additional memory as required
- d. Allowing containers to share network interfaces with individual access control lists

**Answer:** b. Configuring the kernel to enforce strict resource isolation and limit peripheral access to only allocated devices

---

### Q35
A containerized application is consuming massive memory, causing performance issues. What is the recommended approach to address this problem effectively?

- A. Increase the memory limit for the container
- B. Use a larger base image for the container
- C. Reduce the number of replicas of the container
- D. Analyze the application code for memory leaks

**Answer:** D. Analyze the application code for memory leaks

---

### Q36
A cloud infrastructure requires running multiple isolated environments on a single physical server. Which technology is primarily used to achieve this?

- A. Containers
- B. Virtual Machines (VMs)
- C. Serverless computing

**Answer:** B. Virtual Machines (VMs)

---

### Q41
In a cloud computing environment, which security measure helps protect user accounts by requiring two different types of identification before granting access?

- A. Firewalls
- B. Encryption
- C. Multi-Factor Authentication (MFA)
- D. Antivirus Software

**Answer:** C. Multi-Factor Authentication (MFA)

---

## 2. Computer networks and security

### Q2
A mobile application needs to retrieve a list of all available restaurants from a food delivery service's API. The application should only read data without making any changes to the server resources. Which HTTP method is most appropriate for this operation?

- A. POST
- B. PUT
- C. DELETE
- D. GET

**Answer:** D. GET

---

### Q3
During application development, a developer encounters an error due to an incorrect or unavailable API endpoint, resulting in a "Not Found" response. Which HTTP status code most accurately represents this error?

- A. 404
- B. 500
- C. 403
- D. 400

**Answer:** A. 404

---

### Q5
Which protocol is commonly used to secure data in transit over the internet by encrypting communication between systems?

- A. HTTP
- B. MTP
- C. SSL/TLS
- D. SMTP

**Answer:** C. SSL/TLS

---

### Q7
After initializing a connection attempt to a remote server, consider that a client application sends a SYN packet to indicate the request for establishing a reliable connection. What is the expected response from the server, assuming it is available and prepared to accept the connection from the client?

**Answer:** The server responds with a SYN-ACK packet.

---

### Q8
A network administrator is tasked with selecting a secure wireless encryption protocol. Which of the following is considered the most secure for Wi-Fi networks?

**Answer:** WPA3

---

### Q9. Packet routing / firewall bypass attack
Assume your computer's data was stolen by hackers through your network by mentioning the route to be used by the packets. This is done by the hackers to avoid security measures due to non-analyzing of source information instead of using a Packet filter firewall. What is this type of attack called?

**Answer:** Source Routing Attack

---

### Q12. VPN for remote access
Assume that an employee at a multinational organization is working from home for some reason and needs to access the company's internal network to retrieve some files. Which type of VPN will be best suitable for this case?

**Answer:** Remote Access VPN

---

### Q14. Routing manipulation attack
Hackers can manipulate data packets traveling across a network by inserting malicious routing information, allowing them to redirect traffic through their own systems. This method enables them to pull, extract, or edit data without detection. What type of attack is this called?

**Answer:** Man-in-the-Middle (MITM) attack

---

### Q17
Each party encrypts messages before sending them using a shared secret key, and messages are decrypted by the receiving party using the same key. If an attacker can send a specially crafted message to one party and analyze the resulting encrypted output, which technique is most likely to compromise the secret key in this symmetric encryption system?

- A. Analyzing patterns in intercepted encrypted messages
- B. Comparing the crafted message's encrypted output with previously encrypted messages
- C. Performing a brute-force attack on intercepted messages
- D. Matching message lengths to guess the content

**Answer:** B. Comparing the crafted message's encrypted output with previously encrypted messages

---

### Q19. WPA3 configuration (Android)
Assume that a developer is tasked with configuring a high-security Wi-Fi environment for a sensitive government project using Android devices. The configuration includes:

```
Config SAE = Y
Config SUITEB = Y
Configure SUITEB192 = Y
```

In the given scenario, which configuration line is incorrect or redundant and might potentially weaken the desired security level?

**Answer:** Configure SUITEB192 = Y

---

### Q25
If a company wants to ensure secure and reliable email transmission for its cloud-based email service, which protocol should they implement?

- A. HTTP
- B. FTP
- C. SMTP
- D. POP3

**Answer:** C. SMTP

---

### Q29
Hackers attempt to intercept and manipulate data packets traveling across a network by inserting malicious code or routing information, allowing them to redirect traffic through their own system. This enables them to eavesdrop or alter data without detection. What type of attack is this called?

- A. Packet Sniffing
- B. IP Spoofing
- C. Routing Table Poisoning
- D. DNS Spoofing

**Answer:** C. Routing Table Poisoning

---

### Q33
Two geographically separate offices, Office A and Office B, need to allow all users in Office A to securely access resources in Office B and vice versa, as if they were on the same local network. Which VPN topology is most appropriate for this scenario?

- A. Remote Access VPN
- B. Site-to-Site VPN
- C. Client-to-Server VPN
- D. Peer-to-Peer VPN

**Answer:** B. Site-to-Site VPN

---

### Q34
A development team is designing a new RESTful API to manage a product catalog for their e-commerce platform. They need to create an endpoint that retrieves details of a specific product using its unique product ID. Which HTTP method and URL structure best align with RESTful principles for this operation?

- A. `POST /products/{productId}`
- B. `GET /products/{productId}`
- C. `PUT /products/{productId}`
- D. `DELETE /products/{productId}`

**Answer:** B. `GET /products/{productId}`

---

### Q37
An internet connection is established by a user, connecting devices like a computer, smartphone, and smart TV to a router. Which OSI model layer is responsible for transmitting Ethernet, cable, and Wi-Fi signals between these devices?

- A. Physical Layer
- B. Network Layer
- C. Data Link Layer
- D. Application Layer

**Answer:** A. Physical Layer

---

### Q40
Data packets are transmitted between routers and switches to ensure proper delivery across different network segments. Which OSI model layer is responsible for establishing logical paths and routing data packets between different network segments?

- A. Data Link Layer
- B. Network Layer
- C. Transport Layer
- D. Session Layer

**Answer:** B. Network Layer

---

### Q42
A small business uses ring network topology. If a single workstation goes down, what impact will it have on the network?

- A. Minimal impact; network reroutes traffic
- B. Network becomes isolated
- C. Network slows down
- D. Network breaks completely

**Answer:** D. Network breaks completely

---

### Q43
What is the process of converting data into a secure format to prevent unauthorized access?

- A. Encryption
- B. Authentication
- C. Authorization
- D. Compression

**Answer:** A. Encryption

---

## 3. Operating systems and computer architecture

### Q4
A developer writes a program that needs to create a new process and run a different executable file. Which pair of system calls fulfills this requirement in a Unix-like OS?

**Answer:** `fork()` and `exec()`

---

### Q10. Computer architecture, accumulator to memory
As a computer architect, you are designing the control unit of a CPU. You need to specify how data is moved from the accumulator to the memory. Which of the following best describes this operation?

**Answer:** Store instruction

---

### Q15. OS context switching
During a context switch, consider that the operating system saves the state of the currently running process and loads the state of the next process to be executed. Which crucial CPU register responsible for loading the address of the next instruction to be fetched must be saved and restored during this operation?

**Answer:** Program Counter (PC)

---

### Q16. I/O bus and device controller
Suppose you want to design a bus system where input-output devices are connected to the computer via wires, and data transfer is handled electronically. The host controller sends messages to the device controller, which performs the operation. If the device controllers have a built-in cache for faster data transfer, which device will you choose?

- A. Enhanced Integrated Device Electronics A
- B. Enhanced Integrated Device Electronics B
- C. Enhanced Integrated Device Electronics C
- D. Enhanced Integrated Hard Driver

**Answer:** B. Enhanced Integrated Device Electronics B (EIDE B)

---

### Q21. OS property, application compatibility
Consider you are a software developer working on a new application for a large corporation. Your application is expected to run on a variety of different computers with varying hardware specifications and operating systems. Which property of an operating system is most important for you to consider?

**Answer:** Resource Allocation

---

### Q28
Data is transferred between the CPU and a peripheral device through a shared bus controlled by device controllers to improve data transfer speed and reduce latency. The system uses controllers with dedicated high-speed buffers. Which of the following device controllers is most suitable for this purpose?

- A. Wireless Controller
- B. USB Controller
- C. SATA Controller
- D. Ethernet Controller

**Answer:** C. SATA Controller

---

### Q30
You are employed by a company that has recently suffered a security breach. As the IT manager, you are responsible for enhancing the security of the computer's operating system. Which property of an operating system should you prioritize to achieve this goal?

- A. Access Control
- B. User Interface
- C. Multitasking
- D. Virtual Memory

**Answer:** A. Access Control

---

### Q32
During a context switch, the operating system saves the state of the currently running process and loads the state of the next process to be executed. Which CPU register, responsible for holding the address of the next instruction to be fetched, must be saved and restored during this operation?

- A. Stack Pointer
- B. General Purpose Register
- C. Program Counter
- D. Instruction Register

**Answer:** C. Program Counter

---

## 4. DBMS, Excel and MS Office

### Q24
You are building a training module in MS PowerPoint and want to restrict navigation so that users must view each slide sequentially with narration, without freely skipping slides. Which setting provides the strictest control over slide navigation?

- A. Add hyperlinks between slides
- B. Use normal Slide Show mode
- C. Set up Slide Show as Browsed at a kiosk (full screen)
- D. Enable Presenter View

**Answer:** C. Set up Slide Show as Browsed at a kiosk (full screen)

---

### Q26
To create a document template for repeated use, which file format should you save the document in?

- A. .docx
- B. .pdf
- C. .dotx
- D. .txt

**Answer:** C. .dotx

---

### Q31
Jane wants to create a slide that illustrates a progression over time using icons, text, and blanks. She wants it to appear visually dynamic without manually animating each step. Which MS PowerPoint feature can help speed up this process?

- A. Use Slide Zoom feature to create dynamic progression
- B. Use a SmartArt process layout
- C. Apply the Morph transition across duplicated slides for a smooth effect
- D. Create a custom layout with background images and animation triggers

**Answer:** C. Apply the Morph transition across duplicated slides for a smooth effect

---

### Q39
In a PivotTable, which feature allows you to create custom calculations and summaries based on the existing data?

- A. Calculated Fields
- B. Calculated Items
- C. Slicers
- D. Grouping

**Answer:** A. Calculated Fields
