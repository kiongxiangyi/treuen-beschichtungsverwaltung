# Treuen Beschichtungsverwaltung

## Description

Treuen Beschichtungsverwaltung is a web application designed to manage coating tools efficiently. It works seamlessly with SAP and E-Labels integration. Users can scan orders using the web app, which in turn calls the SAP interface to retrieve coating information. Once the information is retrieved, the associated E-Label lights up, indicating that the coating tools are ready to be stored inside the vending machine. Users can then click on the E-Label to complete the storage process.

## Installation

To run Treuen Beschichtungsverwaltung locally, follow these steps:

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/kiongxiangyi/treuen-beschichtungsverwaltung.git
   ```

2. Navigate to the project directory:

   ```
   cd treuen-beschichtungsverwaltung
   ```

3. Install dependencies using npm:

   ```
   npm install
   ```

4. Start the application:

   ```
   npm start
   ```

5. Access the application in your web browser at `http://localhost:3000`.

## Usage

After installing the application, you can use it to store and retrieve coating materials using E-labels. Here's how it works:

1. Scan orders using the web application interface.
2. The web application will call the SAP interface to retrieve coating information.
3. Once the coating information is retrieved, the corresponding E-label will light up, indicating that the coating materials are ready for storage.
4. Click on the illuminated E-label to store the coating materials inside the vending machine.

This process ensures efficient management of coating materials and seamless integration with SAP for accurate information retrieval.

"For more detailed information, refer to the documentation in `Prozessbeschreibung.md`."

## Features

- **Seamless Integration with SAP:** Treuen Beschichtungsverwaltung seamlessly integrates with SAP to retrieve accurate coating information, ensuring data consistency and reliability.

- **E-Labels Integration:** The application integrates with E-labels to provide visual indicators when coating materials are ready for storage, streamlining the process and reducing manual errors.

- **Order Scanning:** Users can easily scan orders using the web application interface, facilitating quick access to relevant coating information from SAP.

- **Coating Material Management:** Efficiently manage coating materials by storing and retrieving them using E-labels, optimizing inventory management processes.

- **User-Friendly Interface:** The web application offers a user-friendly interface, making it intuitive for users to navigate and perform tasks effectively.

- **Real-Time Updates:** Users receive real-time updates on coating material availability and status, enhancing visibility and decision-making capabilities.

## Dependencies

Treuen Beschichtungsverwaltung relies on the following dependencies:

- Node.js
- Express.js
- React.js
- MS SQL Server Express

## Contact

For any questions or feedback, please contact [Kiong Xiang Yi](mailto:xiangyi.kiong@guehring.de).
