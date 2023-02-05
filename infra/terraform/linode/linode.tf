variable "root_pass" {
  type        = string
  description = "password for the root user loaded from env"
}

resource "linode_instance" "explore_server" {
  label     = "explore_server"
  image     = "linode/ubuntu18.04"
  region    = "us-southeast"
  type      = "g6-standard-1"
  root_pass = var.root_pass

  group      = "server"
  tags       = ["explore"]
  swap_size  = 256
  private_ip = true
}
