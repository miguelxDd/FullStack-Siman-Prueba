# Usamos la imagen de Java
FROM openjdk:17-jdk-slim

# Directorio de trabajo dentro del contenedor (dockerr)
WORKDIR /app

# Copia el jar generado por el backend
COPY target/*.jar app.jar

# Exponer el puerto en el que corre el backend
EXPOSE 8080

# Comando para correr la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
