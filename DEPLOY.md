# Deployment Instructions

## Prerequisites
- Docker and Docker Compose installed on the target VM.

## Deployment Steps

1. **Transfer Files**
   Copy the following files to your VM (or clone the repository):
   - `Dockerfile`
   - `docker-compose.yml`
   - `nginx.conf`
   - `package.json`
   - `package-lock.json`
   - `src/` directory
   - `public/` directory
   - `index.html`
   - `vite.config.ts`
   - `tsconfig.json` (and other config files)

   *Essentially, copy the entire project directory excluding `node_modules`.*

2. **Run Deployment**
   Navigate to the project directory on your VM and run:

   ```bash
   docker-compose up -d --build
   ```

3. **Verify**
   The application should now be accessible at `http://<VM_IP>:8040`.

## Troubleshooting
- If port 8040 is already in use, edit `docker-compose.yml` and change `"8040:80"` to another port (e.g., `"8041:80"`).
- To view logs:
  ```bash
  docker-compose logs -f
  ```
