FROM node:16.14.2
# Make a Folder
RUN mkdir app
WORKDIR /app
# Copy the files
COPY . .
# Install dependencies and Build
RUN yarn
RUN yarn build

# Start
CMD ["yarn", "start"]