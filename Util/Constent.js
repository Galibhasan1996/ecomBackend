import os from "node:os";

export const currentIPAddress = () => {
    // Get network interfaces
    const networkInterfaces = os.networkInterfaces();

    // Filter for IPv4 addresses
    const addresses = [];
    Object.values(networkInterfaces).forEach((interfaces) => {
        interfaces.forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        });
    });

    // Extract the last number from each IPv4 address
    // const lastNumbers = addresses.map((address) => {
    //     const parts = address.split('.');
    //     return parts[parts.length - 1];
    // });

    return addresses[0]
};

export const customConsole = (message, data) => {
    const now = new Date().toLocaleTimeString();
    console.log(`\x1b[31m ${message} ${now} \x1b[0m`, data);
}

export const currentTime = new Date().toLocaleTimeString()