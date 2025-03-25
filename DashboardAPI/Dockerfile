FROM openjdk:21 AS build

WORKDIR /app

COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle/

RUN chmod +x ./gradlew

RUN ./gradlew dependencies --no-daemon

COPY src src/

RUN ./gradlew build -x test --no-daemon

FROM openjdk:21

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]