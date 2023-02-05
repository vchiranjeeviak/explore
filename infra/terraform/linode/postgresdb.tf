resource "linode_database_postgresql" "explore_db" {
  label      = "explore_db"
  engine_id  = "postgresql/13.2"
  region     = "us-southeast"
  type       = "g6-nanode-1"
  allow_list = ["0.0.0.0/0"]
}
