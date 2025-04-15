import fs from 'fs';

// Genera fechas aleatorias entre dos años con el formato que requiere dni argentino
export function dateRandomFormat(minYear, maxYear) {
    const startDate = new Date(minYear, 0, 1).getTime();
    const endDate = new Date(maxYear, 11, 31).getTime();
    const dateRandom = new Date(startDate + Math.random() * (endDate - startDate));
    
    const day = String(dateRandom.getDate()).padStart(2, '0');
     
    // Los meses son de 0 a 11
    const month = String(dateRandom.getMonth() + 1).padStart(2, '0');
    const year = dateRandom.getFullYear();
    
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

// Genera un dni aleatorio con datos de un usuario aleatorio
export async function generateScanDni(typeDni) {
    try{
      const response = await fetch('https://randomuser.me/api/?nat=es,us');   
      const data = await response.json();
      const user = data.results[0];
      const userData = {
        transactionNumber: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
        lastName: user.name.last.toUpperCase(),
        firstName: user.name.first.toUpperCase(),
        gender: user.gender.charAt(0).toUpperCase(),
        dni: Math.floor(10000000 + Math.random() * 90000000).toString(),
        category: 'B',
        birthDate: dateRandomFormat(1970, 2007),
        issueDate: dateRandomFormat(2010, 2025),
        cuitNumber: Math.floor(100 + Math.random() * 900),
      };
      
      if(typeDni === 0){
        const dniString = `${userData.transactionNumber}@${userData.lastName}@${userData.firstName}@${userData.gender}@${userData.dni}@${userData.category}@${userData.birthDate}@${userData.issueDate}`;
        console.log(`Dni tipo 0:  ${dniString}`);
        return dniString;
      } else {
        const dniString = `${userData.transactionNumber}@${userData.lastName}@${userData.firstName}@${userData.gender}@${userData.dni}@${userData.category}@${userData.birthDate}@${userData.issueDate}@${userData.cuitNumber}`;  
        console.log(`Dni tipo 1:  ${dniString}`);
        return dniString;
      } 
  }
    catch(error){
      console.error(error);
      return error;
    }
  }

// Genera una lista de DNIs aleatorios y los guarda en un archivo json
  export async function generateRandomsScanList(path, cant) {
    const dniList = [];
    for (let i = 0; i < cant; i++) {
        let dni = await generateScanDni(Math.floor(Math.random() * 2));
        dniList.push(dni);
    }
    const jsonContent = JSON.stringify(dniList, null, 2);
    fs.writeFileSync(path, jsonContent, 'utf8');

    return dniList;
  }

  // Obtiene un elemento de una lista json en un índice específico
  export async function getElementJsonAtIndex(listScan, index) {
    const readList = JSON.parse(fs.readFileSync(listScan));
    if (index >= 0 && index < readList.length) {
        return readList[index];

    } else {
        throw new Error('Índice fuera de rango');
    }
  }

// Genera un dni aleatorio con datos de un usuario aleatorio y el caso = 2 fallaria.
  // export async function generateScanDniWithFail(typeDni) {
  //   try{
  //     const response = await fetch('https://randomuser.me/api/?nat=es');   
  //     const data = await response.json();
  //     const user = data.results[0];
  //     const userData = {
  //       transactionNumber: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
  //       lastName: user.name.last.toUpperCase(),
  //       firstName: user.name.first.toUpperCase(),
  //       gender: user.gender.charAt(0).toUpperCase(),
  //       dni: Math.floor(10000000 + Math.random() * 90000000).toString(),
  //       category: 'B',
  //       birthDate: dateRandomFormat(1970, 2007),
  //       issueDate: dateRandomFormat(2010, 2025),
  //       cuitNumber: Math.floor(100 + Math.random() * 900),
  //     };
      
  //     if(typeDni === 0){
  //       const dniString = `${userData.transactionNumber}@${userData.lastName}@${userData.firstName}@${userData.gender}@${userData.dni}@${userData.category}@${userData.birthDate}@${userData.issueDate}`;
  //       console.log(`Dni tipo 0:  ${dniString}`);
  //       return dniString;
  //     } else if (typeDni === 1){
  //       const dniString = `${userData.transactionNumber}@${userData.lastName}@${userData.firstName}@${userData.gender}@${userData.dni}@${userData.category}@${userData.birthDate}@${userData.issueDate}@${userData.cuitNumber}`;  
  //       console.log(`Dni tipo 1:  ${dniString}`);
  //       return dniString;
  //     } else {
  //       const dniString = `${userData.transactionNumber}@${userData.lastName}@${userData.firstName}`;
  //       console.log(`Dni tipo 2:  ${dniString}`);
  //       return dniString;
  //     }
  // }
  //   catch(error){
  //     console.error(error);
  //     return error;
  //   }
  // }

  export async function generateScanDniWithFail(typeDni) {
    try {
        const response = await fetch('https://randomuser.me/api/?nat=es');
        const data = await response.json();
        const user = data.results[0];

        // Función para eliminar acentos
        const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const secondNameList = ['ALBERTO', 'CARLOS', 'MIGUEL', 'JUAN', 'LUIS', 'ANDRES', 'DAVID', 'JAVIER', 'RAFAEL', 'SERGIO', 'NORBERTO', 'GABRIEL'];
        const randomSecondName = secondNameList[Math.floor(Math.random() * secondNameList.length)];

        const userData = {
            transactionNumber: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
            lastName: removeAccents(user.name.last.toUpperCase()),
            firstName: `${removeAccents(user.name.first.toUpperCase())} ${randomSecondName}`,
            gender: user.gender.charAt(0).toUpperCase(),
            dni: Math.floor(10000000 + Math.random() * 90000000).toString(),
            category: 'B',
            birthDate: dateRandomFormat(1970, 2007),
            issueDate: dateRandomFormat(2010, 2025),
            cuilNumber: Math.floor(100 + Math.random() * 900),
            postalCode: Math.floor(1000 + Math.random() * 9000).toString(),
            expirationDate: dateRandomFormat(2025, 2030),
            additionalCode: Math.floor(100 + Math.random() * 900).toString(),
            status: Math.floor(Math.random() * 2).toString(),
            ilr: `ILR:${(Math.random() * 10).toFixed(1)} C:${Math.floor(100000 + Math.random() * 900000)}.${Math.floor(10 + Math.random() * 90)}`,
            unit: `UNIDAD #${Math.floor(1 + Math.random() * 99).toString().padStart(2, '0')}`,
            serial: `S/N: ${Math.floor(1000 + Math.random() * 9000)}>${Math.floor(2000 + Math.random() * 30)}>>${Math.floor(1000 + Math.random() * 9000)}`
        };

        if (typeDni === 0) {
            const dniString = `${userData.transactionNumber}@${userData.lastName}@${userData.firstName}@${userData.gender}@${userData.dni}@${userData.category}@${userData.birthDate}@${userData.issueDate}`;
            console.log(`Dni tipo 0:  ${dniString}`);
            return dniString;
        } else if (typeDni === 1) {
            const dniString = `${userData.transactionNumber}@${userData.lastName}@${userData.firstName}@${userData.gender}@${userData.dni}@${userData.category}@${userData.birthDate}@${userData.issueDate}@${userData.cuilNumber}`;
            console.log(`Dni tipo 1:  ${dniString}`);
            return dniString;
        } else if (typeDni === 2) {
            const dniString = `${userData.transactionNumber}@${userData.lastName}@${userData.firstName}`;
            console.log(`Dni tipo 2:  ${dniString}`);
            return dniString;
        } else if (typeDni === 3) {
            const dniString = `@${userData.dni}    @A@1@${userData.lastName}@${userData.firstName}@ARGENTINA@${userData.birthDate}@M@${userData.issueDate}@${userData.transactionNumber}@${userData.postalCode} @${userData.expirationDate}@${userData.additionalCode}@${userData.status}@${userData.ilr}@${userData.unit}  || ${userData.serial}`;
            console.log(`Dni tipo 3:  ${dniString}`);
            return dniString;
        } else {
            throw new Error('Tipo de DNI no soportado');
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

  // Genera una lista de DNIs aleatorios con y sin fallas y los guarda en un archivo json
  export async function generateRandomsScanListWithFails(path, cant) {
    const dniList = [];
    for (let i = 0; i < cant; i++) {
        let dni = await generateScanDniWithFail(Math.floor(Math.random() * 4));
        dniList.push(dni);
    }
    const jsonContent = JSON.stringify(dniList, null, 2);
    fs.writeFileSync(path, jsonContent, 'utf8');

    return dniList;
  }